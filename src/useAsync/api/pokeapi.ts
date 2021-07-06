export async function getPokemonByName(name: string) {
	const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
	const json = await res.json() as Pokemon
	return json
}