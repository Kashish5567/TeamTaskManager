import AppRoutes from "./routes/AppRoutes";
import { RoleProvider } from "./context/Rolecontext";

function App() {
  return (
    <RoleProvider>
      <AppRoutes />
    </RoleProvider>
  );
}

export default App;
