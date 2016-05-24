export default function escapeSpace() {
    return this.replace(/([\s])/g, space => '\\' + space)
}
