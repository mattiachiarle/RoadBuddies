import { Outlet, useNavigate } from "react-router-dom";
import Box from "./Box";
function Trip() {

  return (
    <>
      <Box>
          <Outlet /> {/* This will render the child routes */}
      </Box>
    </>
  );
}

export default Trip;
