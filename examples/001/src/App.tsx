import { useState } from "react";

const NAMES = ["Kayki", "Gustavo", "Larissa", "Cláudia"];

function Button({
  name,
  count,
  own,
  onClick,
}: {
  name: string;
  count: number;
  own: boolean;
  onClick: () => void;
}) {
  const [ownCount, setOwnCount] = useState(0);

  return (
    <button onClick={own ? () => setOwnCount(ownCount + 1) : onClick}>
      {name}: {own ? ownCount : count}
    </button>
  );
}

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      {NAMES.map((name, i) => (
        <Button
          key={i}
          name={name}
          own={i % 2 === 0}
          count={count}
          onClick={() => setCount(count + 1)}
        />
      ))}
    </>
  );
}

export default App;
