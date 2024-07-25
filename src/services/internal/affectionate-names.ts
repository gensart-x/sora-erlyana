import { Executor } from '@/command-hive'
import * as wweb from '@utils/wweb'
import fs from 'fs'

const affectionateNames: Executor = async (client, message) => {
    const nameList = JSON.parse(fs.readFileSync('assets/affectionate-names.json', 'utf-8'))
    let selectedNames: string[] = []

    for(let i = 1; i <= 5; i++) {
        selectedNames.push(nameList[Math.floor(Math.random() * (nameList.length - 1))])
    }

    selectedNames.forEach(async name => {
        await new Promise(resolve => setTimeout(resolve, [0, 1500][Math.round(Math.random())]))
        wweb.sendMessage(client, message.from, name)
    })
}

export default affectionateNames