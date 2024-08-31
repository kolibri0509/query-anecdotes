import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import NotificationContext from './components/NotificationContext'
import { useReducer } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from './requests'

const notificationReducer = (state,action) => {
  state = action.payload
  return state
}

const App = () => {
  const [notification, notificationDispatch]= useReducer(notificationReducer, null)

  const queryClient = useQueryClient()

  const newAnecdoteMutation = useMutation({ 
    mutationFn: createAnecdote,
    onSuccess: () => queryClient.invalidateQueries({queryKey: ['anecdotes']})
  }
)
  const addAnecdote = (content) => {
    newAnecdoteMutation.mutate({content, votes: 0})
    notificationDispatch({payload: `add anecdote '${content}'`})
    setTimeout(() => notificationDispatch({payload: null}), 5000)
  }

  const updateAnecdoteMutation = useMutation({
    mutationFn : updateAnecdote,
    onSuccess: ()=> queryClient.invalidateQueries({queryKey: ['anecdotes']})
  }
)
  const handleVote = (anecdote) => {
    console.log('vote', anecdote)
    updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
    notificationDispatch({payload: `anecdote '${anecdote.content}' voted`})
    setTimeout(() => notificationDispatch({payload: null}), 5000)
  }
  const result = useQuery({
    queryKey:['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1
  })
  console.log(JSON.parse(JSON.stringify(result)))

  if(result.isLoading){
    return <div>loading data...</div>
  }
  if(result.isError){
    return <div>anecdote service not available due to problems in server</div>
  }

  const anecdotes = result.data
  console.log(anecdotes)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      <h3>Anecdote app</h3>
    
      <Notification />
      <AnecdoteForm addAnecdote={addAnecdote}/>
    
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  )
}
export default App
