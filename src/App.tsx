import BootSequence from "./components/BootSequence";
import HudBackground from "./components/HudBackground";
import { characters } from "./data/characters";
import { useRoute } from "./lib/route";
import ClassicGame from "./modes/ClassicGame";
import Home from "./modes/Home";

export default function App() {
  const [route, go] = useRoute();

  return (
    <>
      <HudBackground />
      <BootSequence count={characters.length} />
      {route === "classic" ? <ClassicGame onHome={() => go("home")} /> : <Home onOpen={go} />}
    </>
  );
}
