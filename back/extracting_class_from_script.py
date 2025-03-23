def extract_class_name(code):
    print("Extracting class name from code...")
    for line in code.splitlines():
        line = line.strip()
        if line.startswith("class"):
            class_name = line.split()[1].split("(")[0]
            return class_name
    return None