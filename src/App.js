import rawAxios from 'axios';
import { Fragment, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import NavBar from './components/UI/NavBar';
import MovieCard from './components/UI/MovieCard';
import Search from './components/pages/Search';
import MovieModal from './components/UI/MovieModal';

function App() {
  const [movies, setMoviesList] = useState();
  const [currentGenre, setcurrentGenre] = useState();
  const [page, setPage] = useState(1);
  const [genreList, setGenreList] = useState();
  const [previousMovieList, setPreviousMovieList] = useState();

  const controlProps = {
    movies,
    setMoviesList,
    currentGenre,
    setcurrentGenre,
    page,
    setPage,
    genreList,
    setGenreList,
    previousMovieList,
    setPreviousMovieList,
  };

  useEffect(() => {
    async function getGenre() {
      const data = await rawAxios.get(
        'https://api.themoviedb.org/3/genre/movie/list?api_key=f4872214e631fc876cb43e6e30b7e731&language=en-US'
      );
      setGenreList(data.data.genres);
    }
    getGenre();
  }, []);

  useEffect(() => {
    async function getMovies(currentGenre, page) {
      if (currentGenre) {
        const data = await rawAxios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=f4872214e631fc876cb43e6e30b7e731&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}&with_genres=${currentGenre}`
        );

        setMoviesList(data.data);

        setPreviousMovieList((previousMovieList) => {
          if (!previousMovieList) return [...data.data.results];
          else {
            console.log(previousMovieList.results);
            return [...previousMovieList.results, ...data.data.results];
          }
        });
      } else {
        const data = await rawAxios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=f4872214e631fc876cb43e6e30b7e731&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=${page}`
        );
        setMoviesList(data.data);

        setPreviousMovieList((previousMovieList) => {
          if (!previousMovieList) return [...data.data.results];
          else {
            console.log(previousMovieList.results);
            return [...previousMovieList.results, ...data.data.results];
          }
        });
      }
    }

    getMovies(currentGenre, page);
  }, [currentGenre, page, setMoviesList, previousMovieList]);

  //original_title
  //results.
  //page
  //overview
  //release_date
  //vote_average

  //https://api.themoviedb.org/3/discover/movie?api_key=f4872214e631fc876cb43e6e30b7e731&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28

  //https://api.themoviedb.org/3/discover/movie?api_key=f4872214e631fc876cb43e6e30b7e731&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1

  //https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&query=${searchKeyWord}&language=en-US&include_adult=false

  // console.log(genreList);

  return (
    <Fragment>
      <NavBar genres={genreList} control={controlProps} />
      <Switch>
        {controlProps.movies && (
          <Route
            path="/"
            render={(props) => <MovieCard movies={controlProps.movies} />}
            exact
          />
        )}
        <Route path="/search" render={() => <Search />} />
      </Switch>
    </Fragment>
  );
}

export default App;
