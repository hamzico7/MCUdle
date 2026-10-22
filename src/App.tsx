import BootSequence from "./components/BootSequence";
import HudBackground from "./components/HudBackground";
import { characters } from "./data/characters";
import { useRoute } from "./lib/route";
import ClassicGame from "./modes/ClassicGame";
import EndlessGame from "./modes/EndlessGame";
import Home from "./modes/Home";
import QuoteGame from "./modes/QuoteGame";

export default function App() {
  const [route, go] = useRoute();

  return (
    <>
      <HudBackground />
      <BootSequence count={characters.length} />
      {route === "classic" ? (
        <ClassicGame onHome={() => go("home")} />
      ) : route === "endless" ? (
        <EndlessGame onHome={() => go("home")} />
      ) : route === "quote" ? (
        <QuoteGame onHome={() => go("home")} />
      ) : (
        <Home onOpen={go} />
      )}
    </>
  );
}
