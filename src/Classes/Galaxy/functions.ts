export const regexRules = [
    /p(u|\*)(t|\*)(o|a|e|i|í|\*)/g,
    /\bhd/g,
    /\bb(i|1)tch\w{0,2}\b/g,
    /\bf\w{1}ck/g,
    /\bc\w{1}br(0|o|ó)n\w/g,
    /\bz(0|o)rr(4|a)/g,
    /\bn(a|4)z(1|i)/g,
    /\bh(1|i)tl(e|3)r/g,
    /\btu\s\w{0,}\s{0,1}m(a|4)dr(e|3)\b/g,
    /\bsh(i|1)t\b/g,
    /\bs(e|3)x/g,
    /\bnsfw\b/g,
    /\bwtf\w{0,}\b/g,
    /p(a|4)j((a|4)(s|)|e\w{0,})/g,
    /\bl(a|4) p(a|4)j(a|4)\b/g,
    /p(e|3)n(e|3|i|1)\w{0,1}\b/g,
    /c(o|0)ñ(o|0|a|4)/g,
    /v(e|3)rg(a|4)/g,
    /\bd(e|3)sc(e|3)r(e|3)br(a|4)d/g,
    /\br(e|3)tr(a|4)s(a|4)d/g,
    /\b(i|1)nc(e|3)st/g,
    /\bm(a|4)ln(a|4)c(i|1)d/g,
    /j(o|0)d((e|3)r|(i|1)d((a|4)|(o|0)))/g,
    /cul(e|3)(r((o|0)|(a|4))|(a|4)(r|d(a|4)))/g,
    /g(i|1)l(i|1)p((i|1)ch(i|1)|(o|0)ll((a|4)s|(e|3)sc(a|4)))/g,
    /p(e|3)l(o|0)tud((a|4)|(o|0)|(e|3))/g,
    /v(i|1)(o|0)l(a\w{1,}|(o|0|ó|e|é))/g,
    /p(i|1)j(a|4)/g,
    /n(e|3)cr(o|0)f(i|i|1)/g,
    /c(a|4)pull(a|4|o\w{1})/g,
    /s(i|1)d(a|4|os\w{1})/g,
    /p(o|0)r(o|0)ng(a|4)/g,
    /pussy/g,
    /z(o|0)(o|0)f(i|1|í)l(i|1|í)/g,
    /s(e|3)m(e|3)n(t(a|4)l|)/g,
    /n(a|4)lg(a|4|ot|on|ón)/g,
    /ch(u|ú)p(a|4)m(e|3)/g,
    /m(a|4)r(i|1)hu(a|4)n/g,
    /m(i|1)(e|3)rd/g,
    /s(o|0)c(a|4)\w{0,4}/g
  ]
  
  export function invalidWords(texto: string): boolean {
    var itHas: boolean = false
    regexRules.forEach((regex) => {
      texto.toLocaleLowerCase().search(regex) >= 0 ? itHas = true : undefined
    })
    return itHas
  }

  export function generarNombrePlaneta(): string {
    const vocales = ['a', 'e', 'i', 'o', 'u'];
    const consonantes = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'que', 'qui', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z', 'br', 'bl', 'cl', 'cr', 'pl', 'pr', 'll', 'tl', 'tr'];
    const longitud = Math.floor(Math.random() * 6) + 4;
    let nombre = '';

    for (let i = 0; i < longitud; i++) {
      if (i % 2 === 0) {
        nombre += consonantes[Math.floor(Math.random() * consonantes.length)];
      } else {
        nombre += vocales[Math.floor(Math.random() * vocales.length)];
      }
    }

    if (invalidWords(nombre)) return this.generarNombrePlaneta()
    else return nombre.charAt(0).toUpperCase() + nombre.slice(1);
  }