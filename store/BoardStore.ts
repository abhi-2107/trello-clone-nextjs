import { getTodosGroupedByColumn } from "@/utils/getTodosGroupedByColumns";
import { create } from "zustand";
import { databases, ID, storage } from "../appwrite";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumn) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  deleteTask:(taskIndex:number,todoId:Todo,id: TypedColumn) => void;
  addTask : (todo: Todo, columnId: TypedColumn) => void;
}

const useBoardStore = create<BoardState>((set,get) => ({
  board: {
    columns: new Map<TypedColumn, Column>(),
  },

  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },

  setBoardState: (board) => set({ board }),

  // updateTodoInDB: async (todo, columnId) => {
  //   await databases.updateDocument(
  //     process.env.NEXT_PUBLIC_DATABASE_ID!,
  //     process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
  //     todo.$id,
  //     {
  //       title: todo.title,
  //       status: columnId,
  //     }
  //   );
  // },

  updateTodoInDB : async (todo, columnId) => {
    try {
      console.log(`Updating todo ${todo.$id} to column ${columnId}`);
      const response = await databases.updateDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        todo.$id,
        {
          title: todo.title,
          status: columnId,
        }
      );
      console.log('Update successful', response);
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  },

  searchString: "",
  setSearchString: (searchString) => set({ searchString }),

  deleteTask: async (taskIndex: number,todo:Todo, id: TypedColumn) => {
    const newColumns = new Map(get().board.columns)
    // delete columns from newColumns
    newColumns.get(id)?.todos.splice(taskIndex,1)
    set({board: {columns : newColumns}})

    if(todo.image){
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }
    await databases.deleteDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      todo.$id
    )
  },

  addTask: async (todo, columnId) => {
    try {
      console.log(`adding todo ${todo} to column ${columnId}`);
      const response = await databases.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID!,
        process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
        ID.unique(),
        {
          title: todo,
          status: columnId,
        }
      );
      console.log('todo added successful', response);
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  },

}));

export { useBoardStore };
