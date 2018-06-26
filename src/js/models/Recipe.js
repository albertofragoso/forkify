import axios from 'axios';
import {proxy, key} from '../config';

export default class Recipe {
  constructor(id){
    this.id = id;
  }

  async getRecipe() {
    try {
      const response = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
      //console.log(response);
      this.title = response.data.recipe.title;
      this.url = response.data.recipe.source_url;
      this.img = response.data.recipe.image_url;
      this.ingredients = response.data.recipe.ingredients;
      this.author = response.data.recipe.publisher;
    } catch(error) {
      alert(error);
    }
  }

  calcTime(){
    // Assuming that we need fifteen minutos for each three ingredients.
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng / 3);
    this.time = periods * 15;
  }

  calcServings(){
    this.servings = 4;
  }

  parseIngredients(){

    const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
    const unitShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
    const units = [...unitShort, 'kg', 'g'];

    const newIngredients = this.ingredients.map(element => {
      // Uniform units.
      let ingredient = element.toLowerCase();
      unitsLong.forEach((unit, i) => {
        ingredient = ingredient.replace(unit, unitShort[i]);
      });

      // Remove parentheses.
      ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

      // Parse ingredients into count, unit and ingredients.
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(element2 => units.includes(element2));

      let objIng;
      if (unitIndex > -1) {
        // There is a unit
        // Ex. 4 cups, arrCount is [4]
        // Ex. 4 1/2 cups, arrCount is [4, 12] --> eval("4+1/2") --> 4.5
        const arrCount = arrIng.slice(0, unitIndex);
        let count;
        if (arrCount === 1) {
          count = eval(arrInt[0].replace('-', '+'));
        } else {
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        }

      } else if (parseInt(arrIng[0], 10)){
        // There is NO unit, but 1st element is number
        objIng = {
          count: parseInt(arrIng[0]),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        }
      } else if (unitIndex === -1) {
        // There is NO unit and NO number in 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        }
      }
      //console.log(ingredient);
      return objIng;

    });
    this.ingredients = newIngredients;
  }

  updateServing(type){
    // Servings
    const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

    // Ingredients
    this.ingredients.forEach(ingredient => {
      ingredient.count *= (newServings / this.servings);
    })

    this.servings = newServings;
  }

}