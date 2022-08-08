
//left_click hightlight left_side
var left_click = Array.from(document.querySelectorAll(".left_nav .line_side"));
var right_content = Array.from(document.querySelectorAll(".right_body"));
var left_tbl = [];
for (let i = 0; i <= left_click.length - 1; i++)
{
    left_click[i].onclick = () =>
    {
        left_click[i].setAttribute('class', 'line_side line_side_active');
        let left_off = Array.from(document.querySelectorAll(".left_nav .line_side.line_side_active"));
        for (let a = 0; a <= left_off.length - 1; a++)
        {
            if (left_click[i] !== left_off[a])
            {
                left_off[a].setAttribute('class', 'line_side');
            }
        }
        for (let b = 0; b <= right_content.length - 1; b++)
        {
            if (i === b) {
                right_content[b].style.display = "block";
            } else {
                right_content[b].style.display = "none";
            }
        }
    };
}


