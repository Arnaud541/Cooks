import { useEffect, useState } from 'react'
import Cooks from "./assets/cooks.svg"
import "./styles/Home.css"

function App() {
  const [error, setError] = useState({
    isError: false,
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [randomRecipes, setRandomRecipes] = useState([])

  useEffect(() => {

    const fetchRecipes = async () => {
      const url = 'https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?number=9';
      const options = {
          method: 'GET',
          headers: {
          'X-RapidAPI-Key': 'cb2c1a5391msh7300edf24cab637p1b4821jsn10305860c233',
          'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
          }
      };

      try {
        setLoading(true)
        const response = await fetch(url, options);
        if (!response.ok) {
          throw new Error("Erreur de chargement des recettes");
        }
        const recipes = await response.json();
        setRandomRecipes(recipes)
        setLoading(false)
      } catch (e) {
        setError({isError: true, message: e.message})
      }
    }
    
    fetchRecipes()
  }, [])

  

  return (
    <>
      <nav className='flex items-center bg-slate-100 h-14 pl-4'>
        <div>
          <img src={Cooks} alt="Logo de Cooks" />
        </div>
      </nav>
      {
        loading && <span className="loading loading-spinner loading-md"></span>
      }
      {
        error.isError && error.message.length != 0 && <h2>Erreur</h2>
      }
    </>
  )
}

export default App
