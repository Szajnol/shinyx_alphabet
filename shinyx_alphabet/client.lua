local MinigameActive = false
local Success = false

function StartGame(cb) 
    if MinigameActive then return end

        SetNuiFocus(true, true)
        SendNUIMessage({action = "startGame"})
        MinigameActive = true

        while MinigameActive do
            Citizen.Wait(500)
        end

        if cb then
            cb(Success)
        end

        return Success
    end

exports('StartGame', StartGame)



RegisterNUICallback('success', function(data, cb)
    SetNuiFocus(false, false)
    Success = true
    MinigameFinished = false
    MinigameActive = false
    cb('ok')
end)

RegisterNUICallback('failed', function(data, cb)
    SetNuiFocus(false, false)
    MinigameActive = false
    Success = false
    cb('ok')
end)

RegisterCommand('testGame', function()
    local success = exports['shinyx_alphabet']:StartGame()
    if success == true then
        print('Completed')
    else
        print("Failed")
    end
end)