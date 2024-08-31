import axios from "axios"
const baseURL = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await axios.get(baseURL)
    return response.data
}

export const createAnecdote = async (newNote) => {
    const response = await axios.post(baseURL, newNote)
    return response.data
}

export const updateAnecdote = async (updatedAnecdote) => {
    const response = await axios.put(`${baseURL}/${updatedAnecdote.id}`, updatedAnecdote)
    return response.data
}

    

