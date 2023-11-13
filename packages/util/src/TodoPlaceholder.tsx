import React from 'react';

type TodoPlaceholderProps = {
  description?: string;
};

function TodoPlaceholderBase(props: TodoPlaceholderProps) {
  const { description } = props;
  return (
    <>
      <p>!!!TODO ITEM!!!</p>
      <p>!!!PLEASE CREATE A TASK FOR ME!!!</p>

      <p>{description}</p>
    </>
  );
}

export const TodoPlaceholder: React.FunctionComponent<TodoPlaceholderProps> = React.memo(TodoPlaceholderBase);
