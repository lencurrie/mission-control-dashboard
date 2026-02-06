import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useCallback } from "react";

interface IndexMemoryFileOptions {
  title: string;
  content: string;
  path: string;
  tags?: string[];
}

interface IndexWorkspaceDocOptions {
  title: string;
  content: string;
  path: string;
  tags?: string[];
}

export function useSearchIndex() {
  const indexMemoryFileMutation = useMutation(api.search.indexMemoryFile);
  const indexWorkspaceDocMutation = useMutation(api.search.indexWorkspaceDoc);
  const removeFromIndexMutation = useMutation(api.search.removeFromIndex);

  const indexMemoryFile = useCallback(
    async (options: IndexMemoryFileOptions) => {
      try {
        const id = await indexMemoryFileMutation(options);
        return { success: true, id };
      } catch (error) {
        console.error("Failed to index memory file:", error);
        return { success: false, error };
      }
    },
    [indexMemoryFileMutation]
  );

  const indexWorkspaceDoc = useCallback(
    async (options: IndexWorkspaceDocOptions) => {
      try {
        const id = await indexWorkspaceDocMutation(options);
        return { success: true, id };
      } catch (error) {
        console.error("Failed to index workspace doc:", error);
        return { success: false, error };
      }
    },
    [indexWorkspaceDocMutation]
  );

  const removeFromIndex = useCallback(
    async (path: string) => {
      try {
        await removeFromIndexMutation({ path });
        return { success: true };
      } catch (error) {
        console.error("Failed to remove from index:", error);
        return { success: false, error };
      }
    },
    [removeFromIndexMutation]
  );

  const indexAllMemoryFiles = useCallback(
    async (files: IndexMemoryFileOptions[]) => {
      const results = [];
      for (const file of files) {
        const result = await indexMemoryFile(file);
        results.push({ file: file.path, ...result });
      }
      return results;
    },
    [indexMemoryFile]
  );

  const indexAllWorkspaceDocs = useCallback(
    async (docs: IndexWorkspaceDocOptions[]) => {
      const results = [];
      for (const doc of docs) {
        const result = await indexWorkspaceDoc(doc);
        results.push({ doc: doc.path, ...result });
      }
      return results;
    },
    [indexWorkspaceDoc]
  );

  return {
    indexMemoryFile,
    indexWorkspaceDoc,
    removeFromIndex,
    indexAllMemoryFiles,
    indexAllWorkspaceDocs,
  };
}