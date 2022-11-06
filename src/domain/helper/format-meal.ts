function formatMeal(data: { [key: string]: string }) {
  const ingredients = []
  for (let i = 1; i <= 20; i++) {
    if (data[`strIngredient${i}`]) {
      ingredients.push({
        ingredient: data[`strIngredient${i}`],
        measure: data[`strMeasure${i}`],
      })
    } else {
      break
    }
  }

  ingredients.sort((a, b) => {
    return a.ingredient.length - b.ingredient.length
  })

  const instructions = data.strInstructions
    .split('\r\n')
    .filter((instruction) => {
      return instruction !== ''
    })

  return {
    id: data.idMeal,
    name: data.strMeal,
    image: data.strMealThumb,
    ingredients,
    instructions: instructions,
    category: data.strCategory,
    area: data.strArea,
    video: data.strYoutube,
  }
}

export default formatMeal
