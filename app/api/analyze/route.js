export async function POST(request) {
  const data = await request.json();

  await new Promise((resolve) => setTimeout(resolve, 10000));

  try {
    // const response = await fetch('/my-backend', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ url })
    // });

    // const result = await response.json();
    const result = { message: "URL analyzed successfully" };
    return Response.json(result);
  } catch (error) {
    return Response.json({ error: "Failed to analyze URL" }, { status: 500 });
  }
}
