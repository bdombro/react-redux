import { Resource } from '@rest-hooks/rest'

export default class PokemonResource extends Resource {
	readonly id: number = 0;
	readonly name: Pokemon['name'] = ''
	readonly sprites: Pokemon['sprites'] = {front_shiny: ''} as any
	

	pk() {return this.name}

	static urlRoot = 'https://pokeapi.co/api/v2/pokemon';
}