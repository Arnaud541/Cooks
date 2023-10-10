import { useEffect, useRef, useState } from 'react'
import Cooks from "./assets/cooks.svg"
import { IoFilterOutline } from "react-icons/io5";
import { AiOutlineSearch } from "react-icons/ai"
import { CiCircleRemove } from "react-icons/ci"
import {dishFilters} from "./filters/dishFilters.js"
import {costFilters} from "./filters/costFilters.js"
import {dietFilters} from "./filters/dietFilters.js"


function App() {
  const [error, setError] = useState({
    isError: false,
    message: ""
  })
  const [loading, setLoading] = useState(false)
  const [recipes, setRecipes] = useState([])
  const [accordeonIsOpen, setAccordeonIsOpen] = useState(false)
  const [filters, setFilters] = useState(dishFilters.concat(costFilters, dietFilters))
  const [search, setSearch] = useState("")
  const [selectedFilters, setSelectedFilters] = useState([])



  const accordeon = useRef();

  useEffect(() => {

    const fetchRecipes = async () => {
      const url = `${import.meta.env.VITE_API_PATH}` + "random?number=9";
      const options = {
          method: 'GET',
          headers: {
          'X-RapidAPI-Key': `${import.meta.env.VITE_API_KEY}`,
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
        setRecipes(recipes.recipes)
        console.log(recipes)
        setLoading(false)
      } catch (e) {
        setError({isError: true, message: e.message})
      }
    }
    
    fetchRecipes()
  }, [])

  async function handleSearch() {
    let url = `${import.meta.env.VITE_API_PATH}complexSearch?query=${search}&addRecipeInformation=true`

    if(selectedFilters.length > 0 ){
      let valuesDishFilters = []
      let valuesDietFilters = []
      selectedFilters.forEach((f) => {
        switch (f.type) {
          case "type":
            valuesDishFilters.push(f.value)
            break;
          case "diet":
            valuesDietFilters.push(f.value)
            break;
          default:
            break;
        }
      })

      if(valuesDietFilters.length > 0) {
        let stringDietFilters = valuesDietFilters.join()
        url += `&diet=${stringDietFilters}` 
      }

      if(valuesDishFilters.length > 0) {
        let stringDishFilters = valuesDishFilters.join()
        url += `&type=${stringDishFilters}` 
      }
    }

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': `${import.meta.env.VITE_API_KEY}`,
        'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
      }
    };
    
    try {
      setLoading(true)
      const response = await fetch(url, options);
      if(!response.ok) {
        throw new Error("Erreur de chargement des recettes");
      }
      const recipes = await response.json();
      
      setRecipes(recipes.results)
      console.log(recipes)
      setLoading(false)
    } catch (e) {
      setError({isError: true, message: e.message})
    }
  }

  function handleInput(e) {
    setSearch(e.target.value)
  }

  function handleDeleteFilter(deletingFilter) {
    const newSelectedFilters = selectedFilters.filter((filter) => filter.value !== deletingFilter.value)
    setSelectedFilters(newSelectedFilters)
  }

  function handleAccordeon() {
    setAccordeonIsOpen(!accordeonIsOpen)
    if(accordeonIsOpen) {
      accordeon.current.style.display = "none"
    }
    else {
      accordeon.current.style.display = "inline-flex"
    } 
  }

  function addFilter(e) {

    const filter = filters.find((f) => f.value === e.target.value)
    setSelectedFilters([...selectedFilters, filter])
  }

  

  return (
    <>
      <nav className='flex items-center bg-slate-100 h-14 pl-4'>
        <div>
          <img src={Cooks} alt="Logo de Cooks" />
        </div>
      </nav>
      <div className='flex justify-center items-center gap-4 mt-20'>
        <input type="text" placeholder="Rechercher une recette..." className="input input-bordered input-xs w-full max-w-xs" onChange={handleInput} />
        <AiOutlineSearch className='text-orange cursor-pointer' onClick={handleSearch} />
        <IoFilterOutline className='text-orange cursor-pointer' onClick={handleAccordeon} />
      </div>
      <div className='flex flex-col' ref={accordeon} style={{display:'none'}} >
        <div className='flex gap-4 mb-5'>
          <h4>Filtres :</h4>
          {
            selectedFilters.map((filter, index) => (
              <span key={index} className='p-1 outline outline-1 outline-orange rounded text-xs flex items-center gap-1'>{filter.label} <CiCircleRemove onClick={() => handleDeleteFilter(filter)} className='text-orange cursor-pointer' /></span>              
            ))
          }
        </div>
        <div  className="join join-vertical mb-4">
        <div className="collapse collapse-arrow join-item border border-base-300">
          <input type="radio" name="my-accordion-4" checked="checked" /> 
          <div className="collapse-title text-xl font-medium">
            Type de plat
          </div>
          <div className="collapse-content flex gap-4">
            {
              dishFilters.map((df,index) => (
                <button key={index} value={df.value} onClick={addFilter} className="btn hover:bg-transparent hover:outline hover:outline-orange hover:outline-1 bg-transparent shadow-md btn-xs sm:btn-sm md:btn-md normal-case">{df.label}</button>
              ))
            }
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-300">
          <input type="radio" name="my-accordion-4" /> 
          <div className="collapse-title text-xl font-medium">
            Coût
          </div>
          <div className="collapse-content flex gap-4">
            {
              costFilters.map((cf,index) => (
                <button key={index} value={cf.value} onClick={addFilter} className="btn hover:bg-transparent hover:outline hover:outline-orange hover:outline-1 bg-transparent shadow-md btn-xs sm:btn-sm md:btn-md normal-case">{cf.label}</button>
              ))
            }
          </div>
        </div>
        <div className="collapse collapse-arrow join-item border border-base-300">
          <input type="radio" name="my-accordion-4" /> 
          <div className="collapse-title text-xl font-medium">
            Régime
          </div>
          <div className="collapse-content flex gap-4">
            {
              dietFilters.map((dietf,index) => (
                <button key={index} value={dietf.value} onClick={addFilter} className="btn hover:bg-transparent hover:outline hover:outline-orange hover:outline-1 bg-transparent shadow-md btn-xs sm:btn-sm md:btn-md normal-case">{dietf.label}</button>
              ))
            }
          </div>
          </div>
        </div>
      </div>
     
      <div className='grid xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-items-center mt-16 gap-y-6 m-auto px-4'>
      
        {
          recipes.map((recipe) => (
            <div key={recipe.id} className="card w-96 bg-base-100 shadow-xl">
              <figure><img src={recipe.image} alt={recipe.title} /></figure>
              <div className="card-body">
                <h2 className="card-title">{recipe.title}</h2>
                <p></p>
              </div>
            </div>
          ))
        }
      </div>
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
