// The marketing site no longer proxies private model inference.
// Real requests use the authenticated console or the public API.
export async function POST() {
  return Response.json(
    { error: "This endpoint has been retired. Use the console playground or the authenticated /v1/systemone API." },
    { status: 410 },
  );
}
