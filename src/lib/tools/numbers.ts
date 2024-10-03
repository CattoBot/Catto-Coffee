export default {
    
    /**
	 * Da formato a un número convirtiendo los miles en "K"
	 * y los millones en "M"
	 * @param num Número al que dar formato
	 * @example
	 * let dosmil = format(2000)
	 * let tresmillones = format(3000000)
	 * console.log(dosmil, tresmillones) // 2K, 3M
	 */
	format(num: number): string {
		if (num >= 1000000) {
			return (num / 1000000).toFixed(1) + "M";
		} else if (num >= 1000) {
			return (num / 1000).toFixed(1) + "K";
		} else {
			return num.toString();
		}
    }
}