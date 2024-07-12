import React from 'react';
import ReactDOM from 'react-dom/client';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.scss';

import Home from './app/Home/Home';
import Game from './app/Game/Game';
import End from './app/End/End';

const router = createBrowserRouter([
  { path: '/', element: <Home />},
  { path: '/game/:img', element: <Game />},
  { path: '/end/:status', element: <End />},
  { path: '*', element: '404'},
])

document.addEventListener('contextmenu', event => event.preventDefault());
document.addEventListener('selectstart', event => event.preventDefault());


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();