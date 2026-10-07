export type RGB = [number, number, number];

export interface Ripple {
    x: number;
    y: number;
    start: number;
}

export interface FieldState {
    time: number;
    // CSS px
    scroll: number;
    // Smoothed scroll speed, 0..1
    energy: number;
    // CSS px from the top-left corner; strength fades the hover effect in and out
    pointer: { x: number; y: number; strength: number };
    ripples: Ripple[];
    tint: RGB;
}

export interface ContourField {
    resize: (quality: number) => void;
    render: (state: FieldState) => void;
    dispose: () => void;
}

export const MAX_RIPPLES = 4;
// Seconds
export const RIPPLE_LIFE = 3.2;

const VERTEX = `#version 300 es
void main() {
    vec2 pos = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(pos * 2.0 - 1.0, 0.0, 1.0);
}`;

// Simplex noise by Ian McEwan and Stefan Gustavson (MIT)
const FRAGMENT = `#version 300 es
precision highp float;

uniform vec2 uRes;
uniform float uTime;
uniform float uScroll;
uniform float uEnergy;
uniform float uPx;
uniform vec3 uPointer;
uniform vec4 uRipples[${MAX_RIPPLES}];
uniform vec3 uTint;
uniform vec3 uLine;

out vec4 outColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 p = gl_FragCoord.xy / uRes.y;

    // The terrain scrolls at a quarter of the page speed
    vec2 q = p - vec2(0.0, uScroll * 0.25 / uRes.y);
    float t = uTime * 0.03;
    float h = 0.6 * snoise(q * 1.6 + vec2(t, t * 0.6))
            + 0.3 * snoise(q * 3.3 - vec2(t * 0.7, -t) + 11.0);

    // Hill under the pointer
    vec2 dp = p - uPointer.xy / uRes.y;
    float near = uPointer.z * exp(-dot(dp, dp) * 22.0);
    h += uPointer.z * 0.22 * exp(-dot(dp, dp) * 14.0);

    // Rings from taps
    float rip = 0.0;
    for (int i = 0; i < ${MAX_RIPPLES}; i++) {
        vec4 r = uRipples[i];
        float age = uTime - r.z;
        if (r.w > 0.5 && age >= 0.0 && age < ${RIPPLE_LIFE.toFixed(1)}) {
            float w = distance(p, r.xy / uRes.y) - age * 0.42;
            float env = exp(-w * w * 55.0) * (1.0 - age / ${RIPPLE_LIFE.toFixed(1)});
            h += 0.16 * env * cos(w * 34.0);
            rip += env;
        }
    }

    // Contour lines, one pixel wide at any slope; every fifth one is an index line
    float f = h * 9.0;
    float aa = max(fwidth(f), 1e-4);
    float d = abs(fract(f + 0.5) - 0.5) / aa;
    float halfW = 0.5 * max(uPx, 1.0);
    float line = 1.0 - smoothstep(halfW - 0.5, halfW + 0.5, d);
    line *= 1.0 - smoothstep(0.18, 0.4, aa);
    float weight = mix(0.5, 1.0, step(mod(floor(f + 0.5), 5.0), 0.5));

    // Tinted glow in two corners, in screen space so it looks the same on any aspect ratio
    vec2 uv = gl_FragCoord.xy / uRes;
    vec2 g1 = uv - vec2(0.95, 0.95);
    vec2 g2 = uv - vec2(0.04, 0.06);
    float glow = exp(-dot(g1, g1) * 3.2) + 0.55 * exp(-dot(g2, g2) * 4.0);

    float lineA = line * weight * (0.055 + 0.04 * uEnergy) + line * (near * 0.18 + rip * 0.12);
    float glowA = glow * 0.04;
    vec3 lineCol = mix(uLine, uTint, clamp(0.15 + glow * 0.45 + near + rip, 0.0, 1.0));

    outColor = vec4(lineCol * lineA + uTint * glowA, min(lineA + glowA, 1.0));
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        if (process.env.NODE_ENV !== 'production') console.warn(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

const UNIFORMS = ['uRes', 'uTime', 'uScroll', 'uEnergy', 'uPx', 'uPointer', 'uRipples', 'uTint', 'uLine'] as const;

// Full-screen WebGL2 shader; returns null when WebGL2 isn't available so the page just keeps its flat background
export function createContourField(canvas: HTMLCanvasElement, line: RGB): ContourField | null {
    const gl = canvas.getContext('webgl2', {
        alpha: true,
        antialias: false,
        depth: false,
        powerPreference: 'low-power',
        stencil: false,
    });
    if (!gl) return null;

    let program: WebGLProgram | null = null;
    let uniforms = {} as Record<(typeof UNIFORMS)[number], WebGLUniformLocation | null>;
    let lost = false;
    // Buffer px per CSS px
    let scale = 1;
    const ripples = new Float32Array(MAX_RIPPLES * 4);

    const build = () => {
        const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
        const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT);
        const next = gl.createProgram();
        if (!vertex || !fragment || !next) return false;
        gl.attachShader(next, vertex);
        gl.attachShader(next, fragment);
        gl.linkProgram(next);
        gl.deleteShader(vertex);
        gl.deleteShader(fragment);
        if (!gl.getProgramParameter(next, gl.LINK_STATUS)) {
            gl.deleteProgram(next);
            return false;
        }
        program = next;
        uniforms = Object.fromEntries(
            UNIFORMS.map((name) => [name, gl.getUniformLocation(next, name)])
        ) as typeof uniforms;
        gl.useProgram(next);
        gl.uniform3f(uniforms.uLine, ...line);
        gl.viewport(0, 0, canvas.width, canvas.height);
        return true;
    };
    if (!build()) return null;

    const onLost = (event: Event) => {
        event.preventDefault();
        lost = true;
    };
    const onRestored = () => {
        lost = !build();
    };
    canvas.addEventListener('webglcontextlost', onLost);
    canvas.addEventListener('webglcontextrestored', onRestored);

    return {
        resize(quality) {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5) * quality;
            canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
            canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
            scale = canvas.width / Math.max(canvas.clientWidth, 1);
            if (!lost) gl.viewport(0, 0, canvas.width, canvas.height);
        },
        render(state) {
            if (lost || !program) return;
            const { pointer } = state;

            ripples.fill(0);
            state.ripples.slice(-MAX_RIPPLES).forEach((ripple, i) => {
                ripples.set([ripple.x * scale, canvas.height - ripple.y * scale, ripple.start, 1], i * 4);
            });

            gl.uniform2f(uniforms.uRes, canvas.width, canvas.height);
            gl.uniform1f(uniforms.uTime, state.time);
            gl.uniform1f(uniforms.uScroll, state.scroll * scale);
            gl.uniform1f(uniforms.uEnergy, state.energy);
            gl.uniform1f(uniforms.uPx, scale);
            gl.uniform3f(uniforms.uPointer, pointer.x * scale, canvas.height - pointer.y * scale, pointer.strength);
            gl.uniform4fv(uniforms.uRipples, ripples);
            gl.uniform3f(uniforms.uTint, ...state.tint);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        },
        dispose() {
            canvas.removeEventListener('webglcontextlost', onLost);
            canvas.removeEventListener('webglcontextrestored', onRestored);
            if (program) gl.deleteProgram(program);
            program = null;
        },
    };
}
