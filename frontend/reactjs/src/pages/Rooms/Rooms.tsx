import { SimpleTemplate } from "../../components/templates/SimpleTemplate/SimpleTemplate";
import { ProtectedRoute } from "../../utils/ProtectedRoute";

export function Rooms() {
  return (
    <ProtectedRoute>
      <SimpleTemplate></SimpleTemplate>
    </ProtectedRoute>
  );
}
