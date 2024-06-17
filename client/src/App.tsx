import { Container, Stack } from "@chakra-ui/react";
import Navbar from "./components/Navbar";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import environments from "./environments";

function App() {
    console.log(environments.server_url);

    return (
        <Stack h="100vh">
            <Navbar />
            <Container>
                <TodoForm />
                <TodoList />
            </Container>
        </Stack>
    );
}

export default App;
