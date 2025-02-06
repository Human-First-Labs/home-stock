
// export const load: LayoutServerLoad = async ({ cookies, fetch }) => {
export const load = async ({ cookies, fetch }) => {

  // const result: Response = await fetch(`${PUBLIC_API_URL}/get/my-user`)

  // const parsedResult: {
  //   user: IUser | null,
  //   socketEvent: SocketEvent | null
  // } = await result.json()

  // return {
  //   user: parsedResult.user,
  //   socketEvent: parsedResult.socketEvent,
  //   //NEEDED FOR NO FLICKER
  //   cookies: cookies.getAll()
  // }
  console.log(cookies, fetch)
  return 
}