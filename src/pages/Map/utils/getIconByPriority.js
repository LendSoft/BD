import defaultIcon from '../../../assets/marker.png'
import redIcon from '../../../assets/red-icon.png'
import orangeIcon from '../../../assets/orange-icon.png'
import yellowIcon from '../../../assets/yellow-icon.png'

export const getIconByPriority = (priority) => {
    let markerIcon = defaultIcon;
    switch (priority) {
        case "Незамедлительно":
            markerIcon = redIcon;
            break;
        case "Высокий":
            markerIcon = orangeIcon;
            break;
        case "Средний":
            markerIcon = yellowIcon;
            break;
        default:
            markerIcon = defaultIcon;
            break;
    }
    return markerIcon
}