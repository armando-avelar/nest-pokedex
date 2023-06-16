import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { PokeResponse } from './interfaces/poke-response.interface';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {

  constructor(private pokemonService: PokemonService,
    private http: AxiosAdapter) { }



  async executeSeed() {
    const insertPromiseArray = [];

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    data.results.forEach(({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];
      insertPromiseArray.push(
        this.pokemonService.create({ name, no })
      );
    });

    await Promise.all(insertPromiseArray);

    return 'Seed Execute';
  }

}
