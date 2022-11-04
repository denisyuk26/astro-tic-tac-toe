export type Meal = {
  name: string
  image: string
  ingredients: Ingredient[]
  instructions: string[]
  category: string
  area: string
  video: string
}

export type Ingredient = {
  ingredient: string
  measure: string
}
