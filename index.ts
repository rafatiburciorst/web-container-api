import { WebContainer } from '@webcontainer/api'


const reportOutput = (output: string) => {
    outputPanel.textContent += '\n' + (output)
}

window.addEventListener('load', async () => {
    reportOutput('Booting...')
    const wc = await WebContainer.boot()
    reportOutput('Boot complete')

    const runCommand = async (cmd: string, args: string[]) => {
        const process = await wc.spawn(cmd, args)

        process.output.pipeTo(new WritableStream({
            write: (chunk) => {
                reportOutput(`process output ${chunk}`)
            }
        }))

        if (await process.exit) {
            reportOutput(`Proccess failed and exited with code ${process.exit}`)
        }
    }

    await runCommand('echo', ['Hello World'])

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        const cmd = command.value.split(' ')[0]
        const args = command.value.split(' ').slice(1)
        await runCommand(cmd, args)
    })

    wc.on('server-ready', (port, host) => {
        reportOutput(`Server ready on ${host}:${port}`)
    })


})