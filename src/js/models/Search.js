import axios from 'axios';
import {proxy, key} from '../config';

export default class Search {
  constructor(query) {
    this.query = query;
  }

  async getResponse() {
    try {
      const response = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
      this.results = response.data.recipes;
      //console.log(this.results);
    } catch(error) {
      alert(error);
    }

  }
}
