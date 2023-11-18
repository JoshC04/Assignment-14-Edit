const getMovies = async () => {
  try {
    return (await fetch("api/movies/")).json();
  } catch (error) {
    console.log(error);
  }
};

const showMovies = async () => {
  let movies = await getMovies();
  let moviesDiv = document.getElementById("movies-list");
  moviesDiv.innerHTML = "";
  movies.forEach((movie) => {
    const section = document.createElement("section");
    section.classList.add("movie-section");
    moviesDiv.appendChild(section);

    const a = document.createElement("a");
    a.href = "#";
    section.appendChild(a);

    const h3 = document.createElement("h3");
    h3.innerHTML = movie.title;
    a.appendChild(h3);

    a.onclick = (e) => {
      e.preventDefault();
      displayMovieDetails(movie);
    };
  });
};

const displayMovieDetails = (movie) => {
  const moviesDisplay = document.getElementById("movies-display");
  moviesDisplay.innerHTML = "";

  const h3 = document.createElement("h3");
  h3.innerHTML = movie.title;
  moviesDisplay.appendChild(h3);

  const clear = document.createElement("a");
  clear.innerHTML = "X";
  moviesDisplay.appendChild(clear);
  clear.id = "clear-link";

  const edit = document.createElement("a");
  edit.innerHTML = "&#9998;";
  moviesDisplay.appendChild(edit);
  edit.id = "edit-link";

  const img = document.createElement("img");
  img.src = movie.image;
  moviesDisplay.appendChild(img);

  const length = document.createElement("p");
  length.innerHTML = "Length: " + movie.length+ " minutes";
  moviesDisplay.appendChild(length);

  const year = document.createElement("p");
  year.innerHTML = "Year: " + movie.year;
  moviesDisplay.appendChild(year);

  const director = document.createElement("p");
  director.innerHTML = "Director: " + movie.director;
  moviesDisplay.appendChild(director);

  const actors = document.createElement("ul");
  actors.innerHTML = "Actors: ";
  moviesDisplay.appendChild(actors);

  movie.actors.forEach((actor) => {
    const li = document.createElement("li");
    li.innerHTML = actor;
    actors.appendChild(li);
  });

  clear.onclick = (e) => {
    e.preventDefault();
    moviesDisplay.innerHTML = "";
  };

  edit.onclick = (e) => {
    e.preventDefault();
    document.querySelector(".dialog").classList.remove("hidden");
    document.getElementById("edit-movie-title").innerHTML = "Edit Movie";
  };

  populateEditForm(movie);
};

const populateEditForm = (movie) => {};

const addOrEditMovie = async (e) => {
  e.preventDefault();
  const form = document.getElementById("add-or-edit");
  const formData = new FormData(form);
  let response;

  if (form._id.value == -1) {
    formData.delete("_id");
    formData.delete("image");
    formData.append("actors", getActors());

    console.log(...formData);

    response = await fetch("/api/movies", {
      method: "POST",
      body: formData
    });
  }

  if (response.status != 200) {
    console.log("Error adding movie");
  }

  response = await response.json();
  resetForm();
  document.querySelector(".dialog").classList.add("hidden");
  showMovies();
};

const getActors = () => {
  const inputs = document.querySelectorAll("#actors input");
  let actors = [];

  inputs.forEach((input) => {
    actors.push(input.value);
  });

  return actors;
};

const resetForm = () => {
  const form = document.getElementById("add-or-edit");
  form.reset();
  form._id.value = -1;
  document.getElementById("actors").innerHTML = "";
};

const showHideAdd = (e) => {
  e.preventDefault();
  document.querySelector(".dialog").classList.remove("hidden");
  document.getElementById("edit-movie-title").innerHTML = "Add Movie";
  resetForm();
};

const addActor = (e) => {
  e.preventDefault();
  const actors = document.getElementById("actors");
  const input = document.createElement("input");
  input.type = "text";
  actors.appendChild(input);
};

window.onload = () => {
  showMovies();
  document.querySelector(".close").onclick = () => {
    document.querySelector(".dialog").classList.add("hidden");
  };

  document.getElementById("add-or-edit").onsubmit = addOrEditMovie;
  document.getElementById("add-actor").onclick = addActor;
  document.getElementById("addMovie").onclick = showHideAdd;
};
