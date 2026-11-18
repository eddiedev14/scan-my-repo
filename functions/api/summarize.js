// Puente Pages -> Worker. env.API es el service binding que se configura en el panel
export const onRequest = ({ request, env }) => env.API.fetch(request)
