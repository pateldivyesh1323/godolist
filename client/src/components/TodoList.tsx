import { Flex, Spinner, Stack, Text } from "@chakra-ui/react";
import TodoItem from "./TodoItem";
import environments from "../environments";
import { useQuery } from "@tanstack/react-query";

const TodoList = () => {
    const { data: todos, isLoading } = useQuery<Todo[]>({
        queryKey: ["todos"],
        queryFn: async () => {
            try {
                const res = await fetch(`${environments.server_url}/api/todos`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || "Something went wrong");
                }
                return data || [];
            } catch (error) {
                console.log(error);
            }
        },
    });

    return (
        <>
            <Text
                fontSize={"4xl"}
                textTransform={"uppercase"}
                fontWeight={"bold"}
                textAlign={"center"}
                my={2}
                bgGradient="linear(to-l, #0b85f8, #00ffff)"
                bgClip="text"
            >
                Today's Tasks
            </Text>
            {isLoading && (
                <Flex justifyContent={"center"} my={4}>
                    <Spinner size={"xl"} />
                </Flex>
            )}
            {!isLoading && todos?.length === 0 && (
                <Stack alignItems={"center"} gap="3">
                    <Text
                        fontSize={"xl"}
                        textAlign={"center"}
                        color={"gray.500"}
                    >
                        All tasks completed! 🤞
                    </Text>
                </Stack>
            )}
            <Stack gap={3}>
                {todos?.map((todo) => (
                    <TodoItem key={todo._id} todo={todo} />
                ))}
            </Stack>
        </>
    );
};
export default TodoList;
