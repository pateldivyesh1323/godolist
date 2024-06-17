import {
    Badge,
    Box,
    Flex,
    Spinner,
    Text,
    useColorMode,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FaCheckCircle } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import environments from "../environments";

const TodoItem = ({ todo }: { todo: Todo }) => {
    const { colorMode } = useColorMode();

    const queryClient = useQueryClient();

    const { mutate: updateTodoHandler, isPending: isUpdating } = useMutation({
        mutationKey: ["updateTodo"],
        mutationFn: async () => {
            if (todo.completed) return alert("Todo is already completed");
            try {
                const res = await fetch(
                    `${environments.server_url}/api/todos/${todo._id}`,
                    {
                        method: "PATCH",
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || "Something went wrong");
                }
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    const { mutate: deleteTodoHandler, isPending: isDeleting } = useMutation({
        mutationKey: ["deleteTodo"],
        mutationFn: async () => {
            try {
                const res = await fetch(
                    `${environments.server_url}/api/todos/${todo._id}`,
                    {
                        method: "DELETE",
                    }
                );
                const resData = await res.json();
                if (!res.ok) {
                    throw new Error(resData.msg || "Something went wrong");
                }
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <Flex gap={2} alignItems={"center"}>
            <Flex
                flex={1}
                alignItems={"center"}
                border={"1px"}
                borderColor={"gray.600"}
                p={2}
                borderRadius={"lg"}
                justifyContent={"space-between"}
            >
                <Text
                    color={
                        todo.completed
                            ? colorMode === "light"
                                ? "green.700"
                                : "green.200"
                            : colorMode === "light"
                            ? "yellow.700"
                            : "yellow.100"
                    }
                    textDecoration={todo.completed ? "line-through" : "none"}
                >
                    {todo.body}
                </Text>
                {todo.completed && (
                    <Badge ml="1" colorScheme="green">
                        Done
                    </Badge>
                )}
                {!todo.completed && (
                    <Badge ml="1" colorScheme="yellow">
                        In Progress
                    </Badge>
                )}
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Box color={"green.500"} cursor={"pointer"}>
                    {isUpdating ? (
                        <Spinner size={"sm"} />
                    ) : (
                        <FaCheckCircle
                            size={20}
                            onClick={() => updateTodoHandler()}
                        />
                    )}
                </Box>
                <Box color={"red.500"} cursor={"pointer"}>
                    {isDeleting ? (
                        <Spinner size={"sm"} />
                    ) : (
                        <MdDelete
                            size={25}
                            onClick={() => deleteTodoHandler()}
                        />
                    )}
                </Box>
            </Flex>
        </Flex>
    );
};
export default TodoItem;
