import { Button, Flex, Input, Spinner } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import environments from "../environments";

const TodoForm = () => {
    const queryClient = useQueryClient();

    const [newTodo, setNewTodo] = useState("");

    const { mutate: createTodo, isPending } = useMutation({
        mutationKey: ["createTodo"],
        mutationFn: async (e: React.FormEvent) => {
            e.preventDefault();
            try {
                const res = await fetch(
                    `${environments.server_url}/api/todos`,
                    {
                        method: "POST",
                        headers: {
                            "Content-type": "application/json",
                        },
                        body: JSON.stringify({ body: newTodo }),
                    }
                );
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.msg || "Something went wrong");
                }
                setNewTodo("");
                return data;
            } catch (error) {
                console.log(error);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["todos"] });
        },
    });

    return (
        <form onSubmit={createTodo}>
            <Flex gap={2}>
                <Input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    ref={(input) => input && input.focus()}
                />
                <Button
                    mx={2}
                    type="submit"
                    _active={{
                        transform: "scale(.97)",
                    }}
                >
                    {isPending ? (
                        <Spinner size={"xs"} />
                    ) : (
                        <IoMdAdd size={30} />
                    )}
                </Button>
            </Flex>
        </form>
    );
};
export default TodoForm;
