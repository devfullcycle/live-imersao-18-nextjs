import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function checkoutAction(formData: FormData) {
  "use server";
  console.log("checkoutAction");
  const cookieStore = cookies();
  const reservedSpotRaw = cookieStore.get("spots")?.value;
  const reservedSpots = reservedSpotRaw ? JSON.parse(reservedSpotRaw) : [];

  if (reservedSpots.length == 0) {
    return { error: "Selecione ao menos um assento." };
  }

  const eventId = cookieStore.get("eventId")?.value;
  await fetch(`http://localhost:8000/events/${eventId}/reserve`, {
    method: "POST",
    body: JSON.stringify({
      spots: reservedSpots,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  cookieStore.set("spots", "");
  cookieStore.set("eventId", "");
  redirect("/");
}

export async function CheckoutPage() {
  const cookiesStore = cookies();
  const reservedSpotRaw = cookiesStore.get("spots")?.value;
  const reservedSpots = reservedSpotRaw ? JSON.parse(reservedSpotRaw) : [];

  return (
    <form action={checkoutAction}>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-4">
            <h2 className="text-xl text-black font-bold">Resumo do pedido</h2>
            <p className="text-gray-700 mt-2">
              Assentos selecionados: {reservedSpots.join(", ")}
            </p>
            <p className="text-gray-700 mt-2">Total: R$ 100,00</p>
            <p className="text-gray-700 mt-2">
              <button type="submit" className="bg-black hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
                Confirmar compra
              </button>
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CheckoutPage;
