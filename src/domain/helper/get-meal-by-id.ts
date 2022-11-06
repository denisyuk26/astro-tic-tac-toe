import type { Meal } from '../entities/meal.types'
import formatMeal from './format-meal'

export async function getMealById(id?: string): Promise<Meal> {
  try {
    if (!id) {
      const response = await fetch(
        'https://www.themealdb.com/api/json/v1/1/random.php',
      )
      const data = await response.json()
      const meal = formatMeal(data.meals[0])
      return meal
    }
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`,
    )
    const data = await response.json()
    const meal = formatMeal(data.meals[0])
    return meal
  } catch (error) {
    throw new Error('can not get meal by id')
  }
}
