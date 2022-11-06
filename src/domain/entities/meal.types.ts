export type Meal = {
  id: string
  name: string
  image: string
  ingredients: Ingredient[]
  instructions: string[]
  category: string
  area: string
  video?: string
}

export type Ingredient = {
  ingredient: string
  measure: string
}
