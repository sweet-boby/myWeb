const BASE_PATH = "/myWeb";

export default function imgPathLoader(source) {
  if (!source.includes("/img/")) return source;

  const fixed = source
    .replace(/(=\s*")\/img\//g, `$1${BASE_PATH}/img/`)
    .replace(/(=\s*')\/img\//g, `$1${BASE_PATH}/img/`);

  return fixed;
}
