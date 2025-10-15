// import { render, screen, waitFor, fireEvent } from '@testing-library/react'
// import MachinesPage from '../page'
// import { fetchMachines } from '@/app/api/api'
// import { Provider } from 'react-redux'
// import configureStore from 'redux-mock-store'
// import thunk from 'redux-thunk'

// jest.mock('@/app/api/api', () => ({
//   fetchMachines: jest.fn(),
// }))

// jest.mock('../MachineDetails', () => () => <div>Mock MachineDetails</div>)

// const mockStore = configureStore([thunk])

// describe('MachinesPage', () => {
//   it('renderiza loading e depois a tabela', async () => {
//     ;(fetchMachines as jest.Mock).mockResolvedValue([
//       { name: 'Server1', address: '192.168.0.1', datacenter: 'DC1' },
//       { name: 'Server2', address: '192.168.0.2', datacenter: 'DC2' },
//     ])

//     const store = mockStore({
//       search: { value: '' },
//     })

//     render(
//       <Provider store={store}>
//         <MachinesPage />
//       </Provider>
//     )

//     expect(screen.getByRole('progressbar')).toBeInTheDocument()

//     await waitFor(() => {
//       expect(screen.getByText('Server1')).toBeInTheDocument()
//       expect(screen.getByText('Server2')).toBeInTheDocument()
//     })
//   })

//   it('filtra máquinas pelo searchTerm', async () => {
//     ;(fetchMachines as jest.Mock).mockResolvedValue([
//       { name: 'Alpha', address: '10.0.0.1', datacenter: 'SP' },
//       { name: 'Beta', address: '10.0.0.2', datacenter: 'RJ' },
//     ])

//     const store = mockStore({
//       search: { value: 'alpha' },
//     })

//     render(
//       <Provider store={store}>
//         <MachinesPage />
//       </Provider>
//     )

//     await waitFor(() => {
//       expect(screen.getByText('Alpha')).toBeInTheDocument()
//     })

//     expect(screen.queryByText('Beta')).toBeNull()
//   })

//   it('abre detalhes ao clicar em uma máquina', async () => {
//     ;(fetchMachines as jest.Mock).mockResolvedValue([
//       { name: 'Zeta', address: '10.0.0.3', datacenter: 'BH' },
//     ])

//     const store = mockStore({
//       search: { value: '' },
//     })

//     render(
//       <Provider store={store}>
//         <MachinesPage />
//       </Provider>
//     )

//     await waitFor(() => {
//       expect(screen.getByText('Zeta')).toBeInTheDocument()
//     })

//     fireEvent.click(screen.getByText('Zeta'))

//     expect(screen.getByText('Mock MachineDetails')).toBeInTheDocument()
//   })
// })
