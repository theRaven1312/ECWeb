export default function DirectLink({link, linkClassName}) {
    return (
        <li>
            <i class="fa-solid fa-greater-than ml-2 mr-2 h-4 "></i>
            <a href="#!" className={`${linkClassName}`}>
                {link}
            </a>
        </li>
    );
}
