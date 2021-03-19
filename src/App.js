import React from 'react';

function Ingredients(props) {
  const ing = props.ing;
  return ing.map((element, index) => {
    return (<li key={index} className='ingredient'>{element}</li>);
  });
}

function Directions(props){
  const directions = props.directions;
  return directions.map((element, index) => {
    return (<li key={index} className='direction'>{element}</li>);
  });
}

function Recipe(props) {
  return (
    <div>
      <h1>{props.name}</h1>
      <h3>Ingredients:</h3>
      <ul><Ingredients ing={props.ing}/></ul>
      <h3>Directons:</h3>
      <ol><Directions directions={props.directions}/></ol>
      <button onClick={props.edit}>Edit</button>
    </div>
    );
}

function RecipeForm(props) { 
  const ingList = props.ingredients.map((ingredient, index) => {
    return <li key={index}>{ingredient}<button onClick={() => props.deleteIngredient(ingredient)}>Delete</button></li>
  });

  const dirList = props.directions.map((direction, index) => {
    return <li key={index}>{direction} <button onClick={() => props.deleteDirection(index)}>Delete</button></li>
  });

  return (
  <div>
    <button onClick={() => props.backFromRecipeCreation()}>Back</button>
    <h1>Create new recipe</h1>
    <div>
      <h2>Recipe Name</h2>
      <input type="text" onChange={(event)=>props.nameHandleChange(event)} value={props.nameFormValue}></input>
    </div>
    <div>
      <ul>{ingList}</ul>
      <input type="text" value={props.ingFormValue} onChange={(event) => props.ingHandleChange(event)}></input>
      <button onClick={() => props.addIngredient()}>Add Ingredient</button>
    </div>
    <div>
      <ol>{dirList}</ol>
      <input type="text" value={props.dirFormValue} onChange={(event) => props.dirHandleChange(event)}></input>
      <button onClick={() => props.addDirection()}>Add direction</button>
    </div>
    <button onClick={()=>props.addRecipe()}>Add Recipe</button>
  </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipes : [
        {
          name : "yummy food",
          ingredients : ["bacon", "bacon", "pancakes", "syrup"],
          directions : ["cover pancakes in syrup", "cover bacon in syrup", "enjoy"]
        }, 
        {
          name : 'icky food',
          ingredients : ["1 Cup salami", "4 pounds brussel SPROUTS", "6 light years dog food"],
          directions : ["Eat all the food", "throw up", "Go to the hospital", "WHy wOuLD yoU eAt tHaT mUch dOG fOod?!"],
        }
      ],
      currentRecipe : -1,
      currentlyEditing : false,
      formIngList : [],
      formDirList : [],
      ingFormValue : '',
      dirFormValue : '',
      nameFormValue : '',
      searchBarValue : '',
    };
  }

  render(props) {
    if (this.state.currentlyEditing) {
      return  (<RecipeForm 
        ingFormValue={this.state.ingFormValue}
        dirFormValue={this.state.dirFormValue}
        directions={this.state.formDirList}
        ingredients={this.state.formIngList} 
        addDirection={() => this.addDirection()}
        dirHandleChange={(event) => this.dirHandleChange(event)}
        deleteDirection={(index) => this.deleteDirection(index)}
        addIngredient={() => this.addIngredient()}
        ingHandleChange={(event) => this.ingHandleChange(event)}
        deleteIngredient={(ingredient) => this.deleteIngredient(ingredient)}
        nameHandleChange={(event) => this.nameHandleChange(event)}
        nameFormValue={this.state.nameFormValue}
        addRecipe={() => this.addRecipe()}
        backFromRecipeCreation= {() => this.backFromRecipeCreation()}
        />
      );

    } else if (this.state.currentRecipe >= 0) {
      const index = this.state.currentRecipe;
      const name = this.state.recipes[index].name;
      const ingredients = this.state.recipes[index].ingredients;
      const directions = this.state.recipes[index].directions;
      return (
        <div>
          <button onClick={() => this.setRecipe(-1)}>Back</button>
          <Recipe name={name} ing={ingredients} directions={directions} edit={() => this.editRecipe(index)}/>
        </div>
        );
          
    } else {
      const recipeList = this.state.recipes;
      const searchValue = this.state.searchBarValue.toLowerCase();
      const filteredRecipes = recipeList.filter( recipe => {
        return recipe.name.toLowerCase().includes(searchValue);
      });
      let recipes;
      if (filteredRecipes.length === 0) {
        recipes = <h5>No recipes found</h5>
      } else {
        recipes = filteredRecipes.map(
          (recipe, index) => {
            return ( 
            <li key={index}>
              <button onClick={() => this.setRecipe(index)}>{recipe.name}</button>
              <button onClick={() => this.deleteRecipe(index)}>Delete</button>
            </li>
            );
          });
      }
      return (<div>
        <h1>Recipes</h1>
        <div>
          <div>
            <input type='text' placeholder="Search recipes" value={this.state.searchBarValue} onChange={(event) => this.updateSearchBar(event)}></input>
          </div>
          <button onClick={() => this.createRecipe()}>Add new recipe</button>
        </div>
        <ol>{recipes}</ol>
      </div>);
    }
  }

  editRecipe(index) {
    const name = this.state.recipes[index].name;
    const ingList = this.state.recipes[index].ingredients;
    const dirList = this.state.recipes[index].directions;
    this.deleteRecipe(index);
    
    this.setState({
      currentRecipe : -1,
      currentlyEditing : true,
      nameFormValue : name, 
      formIngList : ingList,
      formDirList : dirList,
    });
  }
  
  createRecipe() {
    this.setState({
      currentlyEditing : true,
    });
  }

  deleteRecipe(index) {
    let recipeList = this.state.recipes.slice();
    recipeList.splice(index, 1);
    this.setState({
      recipes : recipeList,
    });
  }

  setRecipe(index){
    this.setState({
      currentRecipe : index,
    });
  }

  addIngredient() {
    let ingList = this.state.formIngList.slice();
    ingList.push(this.state.ingFormValue);
    this.setState({
      formIngList : ingList,
      ingFormValue : '',
    });
  }
  
  addDirection() {
    let dirList = this.state.formDirList.slice();
    dirList.push(this.state.dirFormValue);
    this.setState({
      formDirList : dirList,
      dirFormValue : '',
    });
  }

  ingHandleChange(event) {
    this.setState({ingFormValue : event.target.value});
  }

  dirHandleChange(event) {
    this.setState({dirFormValue : event.target.value});
  }

  nameHandleChange(event) {
    this.setState({nameFormValue : event.target.value});
  }

  deleteIngredient(ingredient) {
    let ingList = this.state.formIngList.slice();
    const index = ingList.indexOf(ingredient);
    ingList.splice(index, 1);
    this.setState({formIngList : ingList});
  }

  deleteDirection(index) {
    let dirList = this.state.formDirList.slice();
    dirList.splice(index, 1);
    this.setState({formDirList : dirList});
  }

  backFromRecipeCreation() {
    this.setState({
      formIngList : [],
      formDirList : [],
      dirFormValue : '',
      ingFormValue : '',
      nameFormValue : '',
      currentlyEditing : false,
    });
  }

  addRecipe() {
    let recipeList = this.state.recipes.slice();
    const ingredientList = this.state.formIngList.slice();
    const directionList = this.state.formDirList.slice();
    const recipeName = this.state.nameFormValue;

    if (recipeName !== '' && ingredientList.length > 0 && directionList.length > 0) {
      recipeList.push({
        name : recipeName,
        ingredients : ingredientList,
        directions : directionList,
      });
  
      this.setState({
        recipes : recipeList,
      });
      this.backFromRecipeCreation();
    } else {
      alert("The form is incomplete!");
    }
  }

  updateSearchBar(event) {
    this.setState({
      searchBarValue : event.target.value,
    });
  }
}

export default App;