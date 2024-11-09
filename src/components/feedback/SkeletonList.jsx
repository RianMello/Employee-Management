import { Skeleton, Stack } from "@mui/material";

function SkeletonList() {
  return (
    <Stack spacing={2}>
      <Skeleton animation="wave" variant="retangule" height={40} />
      <Skeleton animation="wave" variant="retangule" height={40} />
      <Skeleton animation="wave" variant="retangule" height={40} />
      <Skeleton animation="wave" variant="retangule" height={40} />
      <Skeleton animation="wave" variant="retangule" height={40} />
      <Skeleton animation="wave" variant="retangule" height={40} />
    </Stack>
  );
}

export default SkeletonList;
