/** @type {import('@remix-run/dev').AppConfig} */
export default {
    
    tailwind: true,
    postcss: true,
    serverModuleFormat: "cjs",
    future: {
        v2_errorBoundary: true,
        v2_headers: true,
        v2_meta: true,
        v2_normalizeFormMethod: true,
        v2_routeConvention: true,
    },
    serverBuildPath: "build/index.js",
};