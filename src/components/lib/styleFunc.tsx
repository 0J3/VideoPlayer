export const c = (s: any) => (a: string) => {
	let x = a.split(' ');

	let b = x.map((b: string) => {
		return `${b} ${s[b]}`;
	});

	return b.join(' ');
};
export default c;
