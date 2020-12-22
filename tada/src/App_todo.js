import './App.css';
import { useQuery, useMutation, gql } from '@apollo/client';
import { Button } from 'antd';

const ADD_TODO = gql`
  mutation AddTodo($id: String!, $xlh: String!){
    addTodo(id: $id, xlh: $xlh){
      id, xlh
    }
  }
`;
const UPDATE_TODO = gql`
  mutation UpdateTodo($id: String!, $xlh: String!){
    updateTodo(id: $id, xlh: $xlh){
      id, xlh
    }
  }
`;
const DELETE_TODO = gql`
  mutation DeleteTodo($id: String!){
    deleteTodo(id: $id){
      id
    }
  }
`;
const GET_TODOS = gql`
  query {todos {
    id, xlh
  }}
`;

function AddTodo() {
  let input;
  const [addTodo] = useMutation(ADD_TODO, {
    update(cache, { data: { addTodo } }) {
      cache.modify({
        fields: {
          todos(existingTodos = []) {
            const newTodoRef = cache.writeFragment({
              data: addTodo,
              fragment: gql`
                fragment NewTodo on Todo {
                  id
                  xlh
                }
              `
            });
            return [...existingTodos, newTodoRef];
          }
        }
      });
    }
  });

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addTodo({ variables: { id: input.value, xlh: input.value } });
          input.value = "";
        }}
      >
        <input
          ref={node => {
            input = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}

function Todos() {
  const { loading: queryLoading, error: queryError, data } = useQuery(
    GET_TODOS,
  );

  const [
    updateTodo,
    { loading: mutationLoading, error: mutationError },
  ] = useMutation(UPDATE_TODO);
 
  if (queryLoading) return <p>Loading...</p>;
  if (queryError) return <p>Error :(</p>;

  return data.todos.map(({ id, xlh }) => {
    let input;

    return (
      <div key={id}>
        <p>{xlh}</p>
        <form
          onSubmit={e => {
            e.preventDefault();
            updateTodo({ variables: { id, xlh: input.value } });
            input.value = '';
          }}
        >
          <input
            ref={node => {
              input = node;
            }}
          />
          <button type="submit">Update Todo</button>
          <DelTodo id={id} />
        </form>
        {mutationLoading && <p>Loading...</p>}
        {mutationError && <p>Error :( Please try again</p>}
      </div>
    );
  });
  
}
function DelTodo(props) {
  const did = props.id;
  const [mutate, { loading, error }] = useMutation(DELETE_TODO, {
    variables: { id: did },
    update(cache, { data: { mutate } }) {
      cache.modify({
        id: cache.identify({
          __typename: 'Todo',
          id: localStorage.getItem('id'),
        }),
        fields: {
          todos(existingTodos) {
            const todoRef = cache.writeFragment({
              data: mutate,
              fragment: gql`
                fragment RemoveTodo on Todo {
                  id
                }
              `
            });
            return existingTodos.filter(
              todoRef => todoRef.id !== did
            );
          }
        }
      });
    }
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>An error occurred</p>;
  return (
    <div>
      <Button
        onClick={() => mutate()}
        data-testid={'action-button'}
      >
        Delete
      </Button>
    </div>
  );
}

function App() {
  return(
    <div>
      <AddTodo />
      <Todos />
    </div>
  
  )
}
export default App;
