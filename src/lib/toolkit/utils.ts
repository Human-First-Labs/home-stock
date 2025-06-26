export const convertMalteseFonts = (text: string): string => {
	const replacements: Record<string, string> = {
		ċ: 'c',
		ġ: 'g',
		ħ: 'h',
		ż: 'z',
		//capital letters
		Ċ: 'C',
		Ġ: 'G',
		Ħ: 'H',
		Ż: 'Z'
	};

	return text.replace(/[ċġħżĊĠĦŻ]/g, (match) => replacements[match]);
};
